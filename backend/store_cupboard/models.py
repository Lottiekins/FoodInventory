from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

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

    class Meta:
        verbose_name = 'Inventory'
        verbose_name_plural = 'Inventories'

    def __str__(self):
        return self.name


class Manufacturer(models.Model):
    name = models.CharField(default='', max_length=200)

    class Meta:
        verbose_name = 'Manufacturer'
        verbose_name_plural = 'Manufacturers'

    def __str__(self):
        return self.name


class Brand(models.Model):
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.CASCADE, related_name='manufacturer', default=None)
    name = models.CharField(default='', max_length=200)

    class Meta:
        verbose_name = 'Brand'
        verbose_name_plural = 'Brands'

    def __str__(self):
        return self.name


class Item(models.Model):
    barcode = models.IntegerField(default=None, blank=True, null=True)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='brand', default=None)
    name = models.CharField(default='', max_length=200)
    total_weight = models.IntegerField(default=0)
    total_weight_format = models.CharField(default=GRAM, choices=weight_format_choices, max_length=2)
    image = models.CharField(default=None, blank=True, null=True, max_length=2048)
    portionable = models.BooleanField(default=False, blank=True)
    group_serving = models.IntegerField(default=None, blank=True, null=True)
    portion_weight = models.IntegerField(default=None, blank=True, null=True)
    portion_weight_format = models.CharField(default=GRAM, choices=weight_format_choices, max_length=2,
                                             blank=True, null=True)
    consume_within_x_days_of_opening = models.IntegerField(default=None, blank=True, null=True)

    class Meta:
        verbose_name = 'Item Detail'
        verbose_name_plural = 'Item Details'

    def __str__(self):
        return self.name


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

    class Meta:
        verbose_name = 'Inventoried Item'
        verbose_name_plural = 'Inventoried Items'

    def __str__(self):
        return self.item.name
