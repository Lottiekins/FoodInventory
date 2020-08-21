from django.utils import timezone

from django.db import models


class Inventory(models.Model):
    inventory_name = models.CharField(default='', max_length=200)

    def __str__(self):
        return self.inventory_name


class Item(models.Model):
    item_name = models.CharField(default='', max_length=200)
    item_total_weight = models.IntegerField(default=0)
    item_portion_weight = models.IntegerField(default=0)
    item_weight_format = models.CharField(default='g', max_length=6)
    consume_within_days = models.IntegerField(default=0)

    def __str__(self):
        return self.item_name


class InventoryItem(models.Model):
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    expiration_date = models.DateTimeField(default=timezone.now)
    purchase_date = models.DateTimeField(default=timezone.now)
    opened_date = models.DateTimeField(default=timezone.now)
    consumption_date = models.DateTimeField(default=timezone.now)
    consumed_by = models.CharField(default='', max_length=200)

    def __str__(self):
        return self.expiration_date, self.purchase_date, self.opened_date
