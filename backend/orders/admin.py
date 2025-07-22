from django.contrib import admin
from .models import Order, OrderItem

# Register your models here.


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "total_amount",
                    "status", "created_at", "updated_at")
    list_filter = ("status", "created_at", "user")
    search_fields = ("id", "user__username", "stripe_payment_intent_id")
    date_hierarchy = "created_at"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("id", "order", "product", "quantity",
                    "unit_price", "total_price")
    list_filter = ("product", "order")
    search_fields = ("order__id", "product__name")
