from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^top_scores/$', views.TopScoreListView.as_view(), name='top_score'),
    url(r'^try_again/$', views.TryAgainTemplateView.as_view(), name='try_again'),
]