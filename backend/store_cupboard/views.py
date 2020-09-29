from socket import timeout

from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers.json import DjangoJSONEncoder
from django.forms import model_to_dict
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from requests import Timeout
from requests.utils import requote_uri

import requests
import json

from urllib3.exceptions import ConnectTimeoutError, ReadTimeoutError

from .models import Brand, Item, Inventory, Manufacturer, InventoryItem


# ============================================================================================
#
#   Inventories
#
# ============================================================================================
def get_inventory(request, inventory_id: int):
    response = json.dumps({})
    if request.method == 'GET':
        try:
            response = list(Inventory.objects.filter(id=inventory_id).values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No inventory with that name'}])
    return HttpResponse(json.dumps(response,
                                   sort_keys=True,
                                   indent=1,
                                   cls=DjangoJSONEncoder), content_type="application/json")


def get_all_inventories(request):
    response = json.dumps({})
    if request.method == 'GET':
        try:
            response = list(Inventory.objects.values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No inventory with that name'}])
    return HttpResponse(json.dumps(response,
                                   sort_keys=True,
                                   indent=1,
                                   cls=DjangoJSONEncoder), content_type="application/json")


@csrf_exempt
def add_inventory(request):
    if request.method == 'POST':
        new_inventory: Inventory = json.loads(request.body.decode("utf-8"))
        print('new_inventory:', new_inventory)
        if not len(new_inventory['name']) == 0 and not len(new_inventory['image']) == 0:
            inventory, inventory_created = Inventory.objects.get_or_create(name=new_inventory['name'],
                                                                           image=new_inventory['image'])
            print('inventory_name:', new_inventory['name'], '; inventory_created:', inventory_created)
            # An Inventory called 'abc' was created.
            # An Inventory called 'abc' already exists, try another name.
            response = json.dumps({'inventory_name': new_inventory['name'],
                                   'inventory_created': inventory_created},
                                  sort_keys=True,
                                  indent=1,
                                  cls=DjangoJSONEncoder)
            return HttpResponse(response, content_type="application/json")
    # Any other error.
    response = json.dumps({'inventory_name': None,
                           'inventory_created': False},
                          sort_keys=True,
                          indent=1,
                          cls=DjangoJSONEncoder)
    return HttpResponse(response, content_type="application/json")


@csrf_exempt
def update_inventory_image(request, inventory_id: int):
    if request.method == 'POST':
        image_data_uri: str = request.body.decode("utf-8")
        inventory = Inventory.objects.filter(id=inventory_id)
        if inventory:
            inventory.update(image=image_data_uri)
            response = bool(inventory)
            print('inventory image updated:', bool(inventory))
            return HttpResponse(json.dumps(response), content_type="application/json")
    return HttpResponse(False, content_type="application/json")


@csrf_exempt
def delete_inventory(request, inventory_id: int):
    if request.method == 'DELETE':
        inventory, inventory_deleted = Inventory.objects.filter(id=inventory_id).delete()
        response = bool(inventory)
        print('inventory:', bool(inventory), '; inventory_deleted:', inventory_deleted)
        return HttpResponse(json.dumps(response), content_type="application/json")
    return HttpResponse(False, content_type="application/json")


# ============================================================================================
#
#   Items
#
# ============================================================================================
def get_item(request, item_id: int):
    response = json.dumps([{}])
    if request.method == 'GET':
        try:
            response = list(Item.objects.filter(id=item_id).values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No item with that name'}])
    return HttpResponse(json.dumps(response,
                                   sort_keys=True,
                                   indent=1,
                                   cls=DjangoJSONEncoder), content_type="application/json")


def get_all_items(request):
    response = json.dumps({})
    if request.method == 'GET':
        try:
            response = list(Item.objects.values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No item with that name'}])
    return HttpResponse(json.dumps(response,
                                   sort_keys=True,
                                   indent=1,
                                   cls=DjangoJSONEncoder), content_type="application/json")


@csrf_exempt
def update_item_image(request, item_id: int):
    if request.method == 'POST':
        image_data_uri: str = request.body.decode("utf-8")
        item = Item.objects.filter(id=item_id)
        if item:
            item.update(image=image_data_uri)
            response = bool(item)
            print('item image updated:', bool(item))
            return HttpResponse(json.dumps(response), content_type="application/json")
    return HttpResponse(False, content_type="application/json")


@csrf_exempt
def add_item(request):
    if request.method == 'POST':
        item = json.loads(request.body)
        if not len(item['brand']['manufacturer']['name']) == 0 \
                and not len(item['brand']['name']) == 0 \
                and not len(item['barcode']) == 0 \
                and not len(item['name']) == 0:

            # Make a new Manufacturer if required
            manufacturer, manufacturer_created = \
                Manufacturer.objects.get_or_create(name=item['brand']['manufacturer']['name'])
            print('manufacturer:', manufacturer, '; manufacturer_created:', manufacturer_created)

            # Make a new Brand if required
            brand, brand_created = Brand.objects.get_or_create(manufacturer=manufacturer,
                                                               name=item['brand']['name'])
            print('brand:', brand, '; brand_created:', brand_created)

            if manufacturer and brand:
                # Make a new Item
                item, item_created = Item.objects.get_or_create(
                                        barcode=item['barcode'],
                                        brand=brand,
                                        name=item['name'],
                                        total_weight=item['total_weight'],
                                        total_weight_format=item['total_weight_format'],
                                        image=item['image'],
                                        portionable=item['portionable'],
                                        group_serving=item['group_serving'],
                                        portion_weight=item['portion_weight'],
                                        portion_weight_format=item['portion_weight_format'],
                                        consume_within_x_days_of_opening=item['consume_within_x_days_of_opening'])

                print('item:', item, '; item_created:', item_created)
                response = json.dumps({'item': item.to_json(),
                                       'item_created': item_created})
                return HttpResponse(response, content_type="application/json")
    response = json.dumps([{}])
    return HttpResponse(response, content_type="application/json")


@csrf_exempt
def delete_item(request, item_id: int):
    if request.method == 'DELETE':
        item, item_deleted = Item.objects.filter(id=item_id).delete()
        response = bool(item)
        print('item:', bool(item), '; item_deleted:', item_deleted)
        return HttpResponse(json.dumps(response), content_type="application/json")
    return HttpResponse(False, content_type="application/json")


# ============================================================================================
#
#   Inventory Items
#
# ============================================================================================
def get_inventory_item(request, inventory_item_id: int):
    response = json.dumps([{}])
    if request.method == 'GET':
        try:
            response = list(InventoryItem.objects.filter(id=inventory_item_id).values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No inventory_item with that name'}])
    return HttpResponse(json.dumps(response,
                                   sort_keys=True,
                                   indent=1,
                                   cls=DjangoJSONEncoder), content_type="application/json")


def get_all_inventory_items(request, inventory_id: int):
    response = json.dumps({})
    if request.method == 'GET':
        try:
            inventory_items = InventoryItem.objects.select_related('inventory', 'item',
                                                                   'opened_by_custom_user', 'consumed_by_custom_user')\
                .filter(inventory=inventory_id)\
                .values('id', 'item__name', 'item__image',
                        'inventory_id', 'inventory__name', 'purchase_date', 'expiration_date',
                        'opened', 'opened_date', 'opened_by_id__username',
                        'consumed', 'consumption_date', 'consumed_by_id__username')

            response = list(inventory_items)
            # print('response:', response)
            return HttpResponse(json.dumps(response,
                                           sort_keys=True,
                                           indent=1,
                                           cls=DjangoJSONEncoder), content_type="application/json")
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No inventory_item with that name'}])
    return HttpResponse(response, content_type="application/json")


@csrf_exempt
def add_inventory_item(request):
    response = json.dumps({})
    if request.method == 'POST':
        inventory_item = json.loads(request.body)
        response = inventory_item
    return HttpResponse(response, content_type="application/json")


@csrf_exempt
def update_inventory_item(request, inventory_item_id: int):
    if request.method == 'POST':
        new_inventory_item = json.loads(request.body)
        inventory_item = InventoryItem.objects.filter(id=inventory_item_id)
        if inventory_item:
            inventory_item.update(new_inventory_item)
            response = bool(inventory_item)
            print('inventory_item updated:', bool(inventory_item))
            return HttpResponse(json.dumps(response), content_type="application/json")
    return HttpResponse(False, content_type="application/json")


@csrf_exempt
def delete_inventory_item(request, inventory_item_id: int):
    if request.method == 'DELETE':
        inventory_item, inventory_item_deleted = InventoryItem.objects.filter(id=inventory_item_id).delete()
        response = bool(inventory_item)
        print('inventory_item:', bool(inventory_item), '; inventory_item_deleted:', inventory_item_deleted)
        return HttpResponse(json.dumps(response), content_type="application/json")
    return HttpResponse(False, content_type="application/json")


# ============================================================================================
#
#   Open Food Facts API
#
# ============================================================================================
def get_openfoodfacts_from_barcode_data(request, barcode_data: str):
    url = 'https://world.openfoodfacts.org/api/v0/product/' + barcode_data + '.json'
    response = json.dumps({})
    if request.method == 'GET':
        try:
            # open food facts API - https://wiki.openfoodfacts.org/API
            off_request = requests.get(url, timeout=(5, 20))
            off_json = off_request.json()
            if off_request.status_code == 200 and off_json['status_verbose'] == 'product found':
                return JsonResponse(off_json)
            else:
                return JsonResponse(off_json)
        except (timeout, Timeout, ReadTimeoutError, ConnectTimeoutError, ConnectionResetError):
            return JsonResponse(response)
    return JsonResponse(response)


# ============================================================================================
#
#   Wikipedia API
#
# ============================================================================================
def get_wikipedia_opensearch(request, search_term: str):
    url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + \
          requote_uri(search_term) + '&format=json'
    response = json.dumps({})
    if request.method == 'GET':
        off_request = requests.get(url)
        off_json = off_request.json()
        if off_json[0] and off_json[1] and off_json[0] != off_json[1][0]:
            url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' \
                  + requote_uri(off_json[1][0]) + '&format=json'
            off_request = requests.get(url)
            off_json = off_request.json()
        return JsonResponse({'opensearch': off_json})
    return JsonResponse(response)


def get_wikipedia_extracts(request, search_term: str):
    url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles=' \
          + requote_uri(search_term) + '&format=json'
    response = json.dumps({})
    if request.method == 'GET':
        off_request = requests.get(url)
        off_json = off_request.json()
        pages = off_json['query']['pages']
        page_ids = list(pages.keys())[0]
        if off_json['query']['pages'][page_ids]:
            try:
                extract = off_json['query']['pages'][page_ids]['extract']
                return JsonResponse({'extract': extract})
            except KeyError:
                try:
                    title = off_json['query']['pages'][page_ids]['title']
                    return JsonResponse({'title': title})
                except KeyError:
                    return JsonResponse({'extract': None})
    return JsonResponse(response)
