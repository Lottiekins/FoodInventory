from django.urls import path

from . import views

urlpatterns = [
    path('', views.get_item),
    path('item/', views.get_item),
    path('item/get/<int:item_id>', views.get_item),
    path('item/add/', views.add_item),
    path('item/add/<str:barcode_data>', views.add_item),
    path('item/del/<str:item_name>', views.delete_item),
]
