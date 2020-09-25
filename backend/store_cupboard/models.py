from django.core.serializers.json import DjangoJSONEncoder
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

import json

CustomUser = get_user_model()

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
    image = models.CharField(default=None, blank=True, null=True, max_length=2048)
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
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.DO_NOTHING, related_name='manufacturer', default=None)
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
    image = models.CharField(default=None, blank=True, null=True, max_length=2048)
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
    purchase_date = models.DateTimeField(default=timezone.now)
    expiration_date = models.DateTimeField(default=timezone.now)
    opened = models.BooleanField(default=False, blank=True)
    opened_date = models.DateTimeField(default=None, blank=True, null=True)
    opened_by_id = models.ForeignKey(CustomUser, related_name='opened_by',
                                     on_delete=models.SET_DEFAULT, default=None, blank=True, null=True)
    consumed = models.BooleanField(default=False, blank=True)
    consumption_date = models.DateTimeField(default=None, blank=True, null=True)
    consumed_by_id = models.ForeignKey(CustomUser, related_name='consumed_by',
                                       on_delete=models.SET_DEFAULT, default=None, blank=True, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Inventoried Item'
        verbose_name_plural = 'Inventoried Items'

    def __str__(self):
        return self.item.name
