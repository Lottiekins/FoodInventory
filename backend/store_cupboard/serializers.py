from rest_framework import serializers
from store_cupboard.models import Item


class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = ['brand',
                  'name',
                  'total_weight',
                  'total_weight_format',
                  'image',
                  'portionable',
                  'group_serving',
                  'portion_weight',
                  'portion_weight_format',
                  'consume_within_x_days_of_opening']
