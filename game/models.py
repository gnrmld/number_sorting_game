from django.db import models
from django.utils import timezone

# Create your models here.
class Record(models.Model):
    name = models.CharField(max_length=10, null=True, blank=True)
    elapsed_time = models.FloatField()
    saved_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.elapsed_time)