from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from supermarket_mystore.views.category_view import CategoryList
from supermarket_mystore.views.category_view import CategoryDetail
from supermarket_mystore.views.product_view import ProductList
from supermarket_mystore.views.product_view import ProductDetail

urlpatterns = [
    path('categories/', CategoryList.as_view()),
    path('categories/<int:pk>/', CategoryDetail.as_view()),
    path('products/', ProductList.as_view()),
    path('products/<int:pk>/', ProductDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)