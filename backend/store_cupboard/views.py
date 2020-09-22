from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from requests.utils import requote_uri

import requests
import json

from .models import Item, Brand, Manufacturer, GRAM, Inventory


def get_inventories(request):
    if request.method == 'GET':
        try:
            response = list(Inventory.objects.values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No item with that name'}])
    return HttpResponse(json.dumps(response), content_type="application/json")


def add_inventory(request):
    response = json.dumps({})
    if request.method == 'POST':
        inventory_name = request.body.decode("utf-8")
        if not len(inventory_name) == 0:
            inventory, inventory_created = Inventory.objects.get_or_create(name=inventory_name)
            print('inventory_name:', inventory_name, '; inventory_created:', inventory_created)
            if inventory_created:
                inventory.save()
                return HttpResponse(json.dumps({'inventory_name': inventory_name,
                                                'inventory_created': inventory_created}),
                                    content_type="application/json")
        print('inventory_name:', inventory_name, '; inventory_created:', False)
        return HttpResponse(json.dumps({'inventory_name': inventory_name,
                                        'inventory_created': False}),
                            content_type="application/json")
    return JsonResponse(response)


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


def get_wikipedia_opensearch(request, search_term: str):
    url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + \
          requote_uri(search_term) + '&format=json'
    response = json.dumps({})
    if request.method == 'GET':
        off_request = requests.get(url)
        off_json = off_request.json()
        if off_json[0] != off_json[1][0]:
            url = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' \
                  + requote_uri(off_json[1][0]) + '&format=json'
            off_request = requests.get(url)
            off_json = off_request.json()
        return JsonResponse({'opensearch': off_json})
    return JsonResponse(response)


def get_wikipedia_extracts(request, search_term: str):
    url = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&titles='\
          + requote_uri(search_term) + '&format=json'
    response = json.dumps({})
    if request.method == 'GET':
        off_request = requests.get(url)
        off_json = off_request.json()
        pages = off_json['query']['pages']
        page_ids = list(pages.keys())[0]
        extract = off_json['query']['pages'][page_ids]['extract']
        return JsonResponse({'extract': extract})
    return JsonResponse(response)


def get_item(request, item_id: str):
    response = json.dumps([{}])
    if request.method == 'GET':
        try:
            response = list(Item.objects.filter(id=item_id).values())
        except ObjectDoesNotExist:
            response = json.dumps([{'Error': 'No item with that name'}])
    return HttpResponse(json.dumps(response), content_type="application/json")


def add_item(request, new_item: Item):
    response = json.dumps([{}])
    if request.method == 'POST':
        item, item_created = Item.objects.get_or_create(barcode=new_item.barcode)
        if not item_created:
            item.save()
    return JsonResponse(response)


def delete_item(item_name: str):
    response = json.dumps([{}])
    return JsonResponse(response)
