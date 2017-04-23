from django.shortcuts import render
from django.views import generic
from django.shortcuts import redirect
from django.core.urlresolvers import reverse_lazy

from . import models, forms


class IndexView(generic.CreateView):
    model = models.Record
    template_name = 'game/index.html'
    form_class = forms.IndexForm

    def post(self, request, *args, **kwargs):
        elapsed_time = float(request.POST.get('elapsed_time'))
        
        if self.model.objects.all().count() >= 10:
            top_ten_time = list(self.model.objects.values('elapsed_time').order_by('elapsed_time')[:10])
            if elapsed_time > top_ten_time[-1]['elapsed_time']:
                return redirect(reverse_lazy('game:try_again'))

        form = self.form_class(request.POST or None)

        if form.is_valid():
            form.save()

        request.session['elapsed_time'] = elapsed_time
        return redirect(reverse_lazy('game:top_score'))


class TopScoreListView(generic.CreateView):
    model = models.Record
    template_name = 'game/top_score.html'
    form_class = forms.TopScoreForm

    def get_context_data(self, **kwargs):
        context = super(TopScoreListView, self).get_context_data(**kwargs)

        if not self.model.objects.count():
            return context

        top_ten = self.model.objects.order_by('elapsed_time')[:10]
        rank = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th']
        context['top_ten_rank'] = zip(top_ten, rank)
        context['last_entry'] = self.model.objects.latest('id').id

        if 'elapsed_time' in self.request.session:
            context['elapsed_time'] = self.request.session['elapsed_time']
        return context
    
    def post(self, request, *args, **kwargs):
        record = self.model.objects.filter(name=None, elapsed_time=request.session['elapsed_time']).last()
        form = self.form_class(request.POST or None, instance=record)
        if form.is_valid():
            form.save()

        return redirect(reverse_lazy('game:top_score'))


class TryAgainTemplateView(generic.TemplateView):
    template_name = 'game/try_again.html'