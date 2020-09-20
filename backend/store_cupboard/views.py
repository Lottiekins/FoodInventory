from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from rest_framework import viewsets, permissions

import requests
import json

from .models import Item, Brand, Manufacturer, GRAM, Inventory
from .serializers import ItemSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


def get_inventories(request):
    if request.method == 'GET':
        try:
            response = list(Inventory.objects.values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No item with that name'}])
    return HttpResponse(json.dumps(response), content_type="application/json")


def get_items(request):
    if request.method == 'GET':
        try:
            response = list(Item.objects.values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No item with that name'}])
    return HttpResponse(json.dumps(response), content_type="application/json")


def get_openfoodfacts_from_barcode_data(request, barcode_data: str):
    url = 'https://world.openfoodfacts.org/api/v0/product/' + barcode_data + '.json'
    response = json.dumps({})
    if request.method == 'GET':
        # open food facts API - https://wiki.openfoodfacts.org/API
        off_request = requests.get(url)
        off_json = off_request.json()
        if off_request.status_code == 200 and off_json['status_verbose'] == 'product found':
            return JsonResponse(off_json)
        else:
            return JsonResponse(off_json)
    return JsonResponse(response)


def get_item(request, item_id: str):
    response = json.dumps([{}])
    if request.method == 'GET':
        try:
            response = list(Item.objects.filter(id=item_id).values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No item with that name'}])
    return HttpResponse(json.dumps(response), content_type="application/json")


def add_item(request, barcode_data: str):
    url = 'https://world.openfoodfacts.org/api/v0/product/' + barcode_data + '.json'
    response = json.dumps([{}])
    if request.method == 'GET':
        # open food facts API - https://wiki.openfoodfacts.org/API
        off_request = requests.get(url)
        off_json = off_request.json()
        if off_request.status_code == 200 and off_json['status_verbose'] == 'product found':

            manufacturer_name = ''
            try:
                manufacturer_name = off_json['product']['brands']
                if manufacturer_name == '':
                    manufacturer_name = 'manufacturer-to-be-completed'
            except KeyError:
                manufacturer_name = 'KeyError'
            manufacturer, manufacturer_created = Manufacturer.objects.get_or_create(name=manufacturer_name)
            if not manufacturer_created:
                manufacturer.save()

            brand_name = ''
            try:
                brand_name = off_json['product']['brands']
                if brand_name == '':
                    brand_name = 'brands-to-be-completed'
            except KeyError:
                brand_name = 'KeyError'
            brand, brand_created = Brand.objects.get_or_create(name=brand_name,
                                                               manufacturer=manufacturer)
            if not brand_created:
                brand.save()

            product_name = ''
            try:
                product_name = off_json['product']['product_name']
            except KeyError:
                try:
                    product_name = off_json['product']['product_name_en']
                except KeyError:
                    product_name = 'KeyError'
            item, item_created = Item.objects.get_or_create(name=product_name,
                                                            brand=brand)
            if not item_created:
                item.name = product_name
                item.total_weight = 0
                item.total_weight_format = GRAM

                image_url = ''
                try:
                    image_url = off_json['product']['selected_images']['front']['display'][0]
                except KeyError:
                    image_url = 'KeyError'
                item.image = image_url

                group_serving = 0
                try:
                    group_serving = off_json['product']['nutriments']['nova-group_serving']
                except KeyError:
                    group_serving = 0
                item.portionable = group_serving > 1
                item.group_serving = group_serving

                item.portion_weight = None
                item.portion_weight_format = None
                item.consume_within_x_days_of_opening = None
                item.save()

            qs = Item.objects.filter(name=item.name).values()
            return JsonResponse({"item_added": list(qs)})

        else:
            return JsonResponse({"item_not_added": off_json})

    return JsonResponse(response)


def delete_item(item_name: str):
    response = json.dumps([{}])
    return JsonResponse(response)
