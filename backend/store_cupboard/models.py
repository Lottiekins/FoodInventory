from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

import json

from users.models import CustomUser

GRAM = 'g'
KILOGRAM = 'Kg'
MILLILITRE = 'mL'
LITRE = 'L'
weight_format_choices = (
    (GRAM, 'Grams'),
    (KILOGRAM, 'Kilograms'),
    (MILLILITRE, 'Millilitre'),
    (LITRE, 'Litre')
)


class Inventory(models.Model):
    name = models.CharField(default='', max_length=200)
    image = models.CharField(default=None, blank=True, null=True, max_length=81920)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Inventory'
        verbose_name_plural = 'Inventories'

    def __str__(self):
        return self.name


class Manufacturer(models.Model):
    name = models.CharField(default='', max_length=200)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Manufacturer'
        verbose_name_plural = 'Manufacturers'

    def __str__(self):
        return self.name


class Brand(models.Model):
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.DO_NOTHING,
                                     related_name='manufacturer', default=None)
    name = models.CharField(default='', max_length=200)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'

    def __str__(self):
        return self.name


class Item(models.Model):
    barcode = models.IntegerField(default=None, blank=True, null=True)
    brand = models.ForeignKey(Brand, on_delete=models.DO_NOTHING, related_name='brand', default=None)
    name = models.CharField(default='name', blank=False, null=False, max_length=200)
    total_weight = models.FloatField(default=0.0, blank=True, null=True)
    total_weight_format = models.CharField(default=GRAM, choices=weight_format_choices, max_length=2,
                                           blank=True, null=True)
    image = models.CharField(default=None, blank=True, null=True, max_length=81920)
    portionable = models.BooleanField(default=False, blank=True)
    group_serving = models.IntegerField(default=None, blank=True, null=True)
    portion_weight = models.FloatField(default=0.0, blank=True, null=True)
    portion_weight_format = models.CharField(default=GRAM, choices=weight_format_choices, max_length=2,
                                             blank=True, null=True)
    consume_within_x_days_of_opening = models.IntegerField(default=None, blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Item Detail'
        verbose_name_plural = 'Item Details'

    def __str__(self):
        return self.name

    def to_json(self):
        return json.dumps({
                    'id': self.id,
                    'barcode': self.barcode,
                    'brand': {
                        'id': self.brand.id,
                        'manufacturer': {
                            'id': self.brand.manufacturer.id,
                            'name': self.brand.manufacturer.name,
                            'created_on': self.brand.manufacturer.created_on,
                            'modified_on': self.brand.manufacturer.modified_on
                        },
                        'name': self.brand.name,
                        'created_on': self.brand.created_on,
                        'modified_on': self.brand.modified_on
                    },
                    'name': self.name,
                    'total_weight': self.total_weight,
                    'total_weight_format': self.total_weight_format,
                    'image': self.image,
                    'portionable': self.portionable,
                    'group_serving': self.group_serving,
                    'portion_weight': self.portion_weight,
                    'portion_weight_format': self.portion_weight_format,
                    'consume_within_x_days_of_opening': self.consume_within_x_days_of_opening
                },
                    sort_keys=True,
                    indent=1,
                    cls=DjangoJSONEncoder
                )


class InventoryItem(models.Model):
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE, related_name='inventory')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='item')
    purchase_date = models.DateTimeField(default=None, blank=True, null=True)
    expiration_date = models.DateTimeField(default=None, blank=True, null=True)
    opened = models.BooleanField(default=False, blank=True)
    opened_date = models.DateTimeField(default=None, blank=True, null=True)
    opened_by = models.ForeignKey(CustomUser, related_name='opened_by_custom_user',
                                  on_delete=models.SET_DEFAULT, default=None, blank=True, null=True)
    consumed = models.BooleanField(default=False, blank=True)
    consumption_date = models.DateTimeField(default=None, blank=True, null=True)
    consumed_by = models.ForeignKey(CustomUser, related_name='consumed_by_custom_user',
                                    on_delete=models.SET_DEFAULT, default=None, blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Inventoried Item'
        verbose_name_plural = 'Inventoried Items'

    def __str__(self):
        return self.item.name

    def to_json(self):
        return json.dumps({
            'inventory_item__id': self.id,
            'inventory_item__inventory_id': self.inventory.id,
            'inventory_item__item_id': self.item.id,
            'inventory_item__purchase_date': self.purchase_date,
            'inventory_item__expiration_date': self.expiration_date,
            'inventory_item__opened': self.opened,
            'inventory_item__opened_date': self.opened_date,
            'inventory_item__opened_by_id': self.opened_by_id,
            'opened_by_id__username': 'opened_username',
            'inventory_item__consumed': self.consumed,
            'inventory_item__consumption_date': self.consumption_date,
            'inventory_item__consumed_by_id': self.consumed_by_id,
            'consumed_by_id__username': 'consumed_username',
            'inventory_item__created_on': self.created_on,
            'inventory_item__modified_on': self.modified_on,
            'inventory__id': self.inventory.id,
            'inventory__name': self.inventory.name,
            'inventory__image" as "inventory_image': self.inventory.image,
            'inventory__created_on': self.inventory.created_on,
            'inventory__modified_on': self.inventory.modified_on,
            'item__id': self.item.id,
            'item__barcode': self.item.barcode,
            'item__brand_id': self.item.brand.id,
            'item__name': self.item.name,
            'item__total_weight': self.item.total_weight,
            'item__total_weight_format': self.item.total_weight_format,
            'item__image" as "item_image': self.item.image,
            'item__portionable': self.item.portionable,
            'item__group_serving': self.item.group_serving,
            'item__portion_weight': self.item.portion_weight,
            'item__portion_weight_format': self.item.portion_weight_format,
            'item__consume_within_x_days_of_opening': self.item.consume_within_x_days_of_opening,
            'item__created_on': self.item.created_on,
            'item__modified_on': self.item.modified_on,
        },
            sort_keys=True,
            indent=1,
            cls=DjangoJSONEncoder
        )
