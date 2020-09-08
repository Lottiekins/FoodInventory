from django.http import JsonResponse

from store_cupboard.models import Item
from store_cupboard.serializers import ItemSerializer

from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def get_data(request):
    data = Item.objects.all()
    if request.method == 'GET':
        serializer = ItemSerializer(data, many=True)
        return JsonResponse(serializer.data, safe=False)
