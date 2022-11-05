# sgart-spfx-master-tree-view-webpart

SPFx base template for master tree view (beta)

## Summary

Read parameter from querystring (ex. idMaster=10) and reader master and details information from SharePoint lists and dispay details as 2 level tree

N.B. non adatto per liste di grandi dimensioni

## install project

node v. 16.x

SPFX v. 1.15

npm install gulp-cli yo @microsoft/generator-sharepoint --global

yo @microsoft/sharepoint

gulp trust-dev-cert

## Debug

gulp serve

usare chrome all'indirizzo https://NomeTenant.sharepoint.com/_layouts/15/workbench.aspx?idMaster=10

passare in querystring l'id della testata da visualizzare

con firefox Warning:

Your web part will not appear in the toolbox. Please make sure "gulp serve" is running in a web part project. Please refresh the page once "gulp serve" is running.
Click here for more information.

## Dati di esempio

Per testare l'esempio creare 3 liste SharePoint 

### Regioni

- Title (Single line of text)
- CodRegione (Single line of text)

### Province

- Title (Single line of text)
- CodProvincia (Single line of text)
- Regione (lookup to Regioni)

### Comuni

- Title (Single line of text)
- CodErariale (Single line of text)
- Provincia (lookup to Province)

## Screenshot

![Dati di esempio](images/sgart-spfx-md-01.png)

![Screenshot](images/sgart-spfx-md-02.png)

## Links

[Fluent UI - Controls](https://developer.microsoft.com/en-us/fluentui#/controls/web)
