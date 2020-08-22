from django.contrib import admin

# Register your models here.
from .models import Inventory
from .models import Item
from .models import InventoryItem

admin.site.register(Inventory)
admin.site.register(Item)
admin.site.register(InventoryItem)
