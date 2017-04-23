from django import forms
from . import models


class IndexForm(forms.ModelForm):
    class Meta:
        model = models.Record
        fields = [
            'elapsed_time',
        ]

        widgets = {
            'elapsed_time': forms.HiddenInput(attrs={'id': 'elapsed_time'}),
        }


class TopScoreForm(forms.ModelForm):
    class Meta:
        model = models.Record
        fields = [
            'name'
        ]

        widgets = {
            'name': forms.TextInput(attrs={'maxlength': 10, 'class': 'form-control'}),
        }