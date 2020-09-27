from django.urls import path

from . import views

urlpatterns = [
    path('inventories', views.get_all_inventories),
    path('inventory/<int:inventory_id>', views.get_inventory),
    path('inventory/add', views.add_inventory),
    path('inventory/delete/<int:inventory_id>', views.delete_inventory),

    path('items', views.get_all_items),
    path('item/<int:item_id>', views.get_item),
    path('item/add/', views.add_item),
    path('item/del/<int:item_id>', views.delete_item),

    path('openfoodfacts/barcode/<str:barcode_data>', views.get_openfoodfacts_from_barcode_data),

    path('wikipedia/opensearch/<str:search_term>', views.get_wikipedia_opensearch),
    path('wikipedia/extracts/<str:search_term>', views.get_wikipedia_extracts),
]
