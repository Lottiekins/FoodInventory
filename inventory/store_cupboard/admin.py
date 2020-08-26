from django.contrib import admin

# Register your models here.
from .models import Inventory
from .models import Manufacturer
from .models import Brand
from .models import Item
from .models import InventoryItem


class BrandAdmin(admin.ModelAdmin):
    list_display = ('manufacturer', 'name')


class ItemAdmin(admin.ModelAdmin):
    list_display = ('brand', 'name', 'total_weight', 'total_weight_format',
                    'portionable', 'portion_weight', 'consume_within_x_days_of_opening')
    list_filter = ('total_weight_format', 'portionable')


class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('item', 'inventory', 'purchase_date', 'expiration_date',
                    'opened', 'opened_date', 'opened_by_id',
                    'consumed', 'consumption_date', 'consumed_by_id')
    list_filter = ('purchase_date', 'expiration_date',
                   'opened',
                   'consumed')


admin.site.register(Inventory)
admin.site.register(Manufacturer)
admin.site.register(Brand, BrandAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(InventoryItem, InventoryItemAdmin)
