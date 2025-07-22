import stripe
from django.conf import settings
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.core.mail import send_mail
from .models import Order, OrderItem
from .serializers import OrderSerializer, CreateOrderSerializer
from store.models import CartItem

stripe.api_key = settings.STRIPE_SECRET_KEY


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    serializer = CreateOrderSerializer(data=request.data)
    if serializer.is_valid():
        payment_method_id = serializer.validated_data['payment_method_id']

        # Get cart items
        cart_items = CartItem.objects.filter(user=request.user)
        if not cart_items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate total
        total_amount = sum(item.total_price for item in cart_items)

        try:
            # Create payment intent
            payment_intent = stripe.PaymentIntent.create(
                amount=int(total_amount * 100),  # Stripe uses cents
                currency='usd',
                payment_method=payment_method_id,
                confirm=True,
                return_url='http://localhost:3000/order-success',
            )

            # Create order
            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount,
                stripe_payment_intent_id=payment_intent.id
            )

            # Create order items
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    unit_price=cart_item.product.price
                )

                # Update inventory
                cart_item.product.inventory_count -= cart_item.quantity
                cart_item.product.save()

            # Clear cart
            cart_items.delete()

            # Send confirmation email
            send_mail(
                'Order Confirmation',
                f'Your order #{order.id} has been confirmed. Total: ${total_amount}',
                settings.DEFAULT_FROM_EMAIL,
                [request.user.email],
                fail_silently=True,
            )

            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except stripe.error.StripeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
