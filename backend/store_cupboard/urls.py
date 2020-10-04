from django.urls import path

from . import views

urlpatterns = [
    # Inventory
    path('inventories', views.get_all_inventories),
    path('inventory/<int:inventory_id>', views.get_inventory),
    path('inventory/add', views.add_inventory),
    path('inventory/update/<int:inventory_id>/image', views.update_inventory_image),
    path('inventory/delete/<int:inventory_id>', views.delete_inventory),

    # Item
    path('items', views.get_all_items),
    path('item/<int:item_id>', views.get_item),
    path('item/add/', views.add_item),
    path('item/update/<int:item_id>/image', views.update_item_image),
    path('item/del/<int:item_id>', views.delete_item),

    # InventoryItem
    path('inventory/<int:inventory_id>/items', views.get_all_inventory_items),
    path('inventory/<int:inventory_id>/item/<int:inventory_item_id>', views.get_inventory_item),
    path('inventory/<int:inventory_id>/item/add', views.add_inventory_item),
    path('inventory/<int:inventory_id>/item/update/<int:inventory_item_id>/opened', views.update_inventory_item_opened),
    path('inventory/<int:inventory_id>/item/update/<int:inventory_item_id>/consumed', views.update_inventory_item_consumed),
    path('inventory/<int:inventory_id>/item/delete/<int:inventory_item_id>', views.delete_inventory_item),

    # OpenFoodFacts
    path('openfoodfacts/barcode/<str:barcode_data>', views.get_openfoodfacts_from_barcode_data),

    # Wikipedia
    path('wikipedia/opensearch/<str:search_term>', views.get_wikipedia_opensearch),
    path('wikipedia/extracts/<str:search_term>', views.get_wikipedia_extracts),

]
