from django.contrib import admin

# Register your models here.
from .models import Inventory
from .models import Manufacturer
from .models import Brand
from .models import Item
from .models import InventoryItem


class ManufacturerAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_on', 'modified_on',)
    readonly_fields = ('created_on', 'modified_on',)


class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'manufacturer', 'created_on', 'modified_on',)
    readonly_fields = ('created_on', 'modified_on',)


class InventoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_on', 'modified_on',)
    readonly_fields = ('created_on', 'modified_on',)


class ItemAdmin(admin.ModelAdmin):
    list_display = ('barcode', 'brand', 'name', 'total_weight', 'total_weight_format',
                    'portionable', 'group_serving', 'portion_weight', 'consume_within_x_days_of_opening',)
    readonly_fields = ('created_on', 'modified_on',)
    list_filter = ('total_weight_format', 'portionable',)


class InventoryItemAdmin(admin.ModelAdmin):
    list_display = ('item', 'inventory', 'purchase_date', 'expiration_date',
                    'opened', 'opened_date', 'opened_by_id',
                    'consumed', 'consumption_date', 'consumed_by_id',)
    readonly_fields = ('created_on', 'modified_on',)
    list_filter = ('purchase_date', 'expiration_date',
                   'opened',
                   'consumed',)


admin.site.register(Inventory, InventoryAdmin)
admin.site.register(Manufacturer, ManufacturerAdmin)
admin.site.register(Brand, BrandAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(InventoryItem, InventoryItemAdmin)
