from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(),
         name='product-detail'),
    path('cart/', views.CartListView.as_view(), name='cart-list'),
    path('cart/add/', views.CartCreateView.as_view(), name='cart-add'),
    path('cart/<int:pk>/', views.CartUpdateView.as_view(), name='cart-update'),
    path('cart/<int:pk>/delete/', views.CartDeleteView.as_view(), name='cart-delete'),
]
