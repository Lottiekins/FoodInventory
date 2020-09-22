from django.urls import path

from . import views

urlpatterns = [
    path('inventories', views.get_inventories),
    path('inventory/add', views.add_inventory),

    path('openfoodfacts/barcode/<str:barcode_data>', views.get_openfoodfacts_from_barcode_data),

    path('wikipedia/opensearch/<str:search_term>', views.get_wikipedia_opensearch),
    path('wikipedia/extracts/<str:search_term>', views.get_wikipedia_extracts),

    path('items', views.get_items),
    path('item/get/<int:item_id>', views.get_item),
    path('item/add/', views.add_item),
    path('item/del/<str:item_name>', views.delete_item),
]
