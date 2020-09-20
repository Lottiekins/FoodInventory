from django.urls import path

from . import views

urlpatterns = [
    path('', views.get_item),
    path('inventories', views.get_inventories),
    path('items', views.get_items),
    path('openfoodfacts/barcode/<str:barcode_data>', views.get_openfoodfacts_from_barcode_data),
    path('item/get/<int:item_id>', views.get_item),
    # path('item/add/<Item:item_data>', views.add_item),
    path('item/del/<str:item_name>', views.delete_item),
]
