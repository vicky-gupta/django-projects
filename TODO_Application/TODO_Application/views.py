from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from TODO_Application.models import TodoItem
from django.contrib.auth import authenticate, login, logout, decorators
from . import models




def signup(request):
    if request.method == 'POST':
        fnm=request.POST.get('fnm')
        emailid=request.POST.get('email')
        pwd=request.POST.get('pwd')
        print(fnm, emailid, pwd)
        my_user=User.objects.create_user(fnm, emailid, pwd)
        my_user.save()
        return redirect('/login')

    return render(request, 'signup.html')

def user_login(request):
    if request.method == 'POST':
        fnm=request.POST.get('fnm')
        pwd=request.POST.get('pwd')
        print(fnm, pwd)
        user=authenticate(request, username=fnm, password=pwd)
        if user is not None:
            login(request, user)
            return redirect('/TODOPage')
        else:
            print("Invalid credentials")
            return redirect('/login')
    return render(request, 'login.html')


@decorators.login_required(login_url='/login')
def todo(request):
    if request.method == 'POST':
        title=request.POST.get('title')
        print(title)
        obj=models.TodoItem(title=title, user=request.user)
        obj.save()
        res = models.TodoItem.objects.filter(user=request.user).order_by('-date')
        return redirect('/TODOPage', {'res': res})
    res = models.TodoItem.objects.filter(user=request.user).order_by('-date')
    return render(request, 'todo.html', {'res': res})

@decorators.login_required(login_url='/login')
def edit_todo(request, srno):
    if request.method == 'POST':
        title=request.POST.get('title')
        print(title)
        obj=models.TodoItem.objects.get(srno=srno)
        obj.title=title
        obj.save()
        return redirect('/TODOPage', {'obj': obj})
    obj=models.TodoItem.objects.get(srno=srno)
    return render(request, 'todo.html')

@decorators.login_required(login_url='/login')
def delete_todo(request, srno):
    obj=models.TodoItem.objects.get(srno=srno)
    obj.delete()
    return redirect('/TODOPage')
def signout(request):
    logout(request)
    return redirect('/login')