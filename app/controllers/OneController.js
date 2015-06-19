/**
 * Created by vasil on 6/10/15.
 */

function OneController() {

}

OneController.prototype.onCreateView = function (view) {
    var promise = Ajax.getRequest(Application.getConfigValue('dataPath') + '/app/data.json');
    var _this = this;
    promise.setOnSuccess(function(xhr) {
        var data = JSON.parse(xhr.responseText);
        view.appendChild(_this.renderList(data))
    });
}

OneController.prototype.renderList = function (data) {
    var fragment = document.createDocumentFragment();
    var container = document.createElement('div');
    var table = '<table>\n\
<tr><th>Name</th><th>Age</th><th></th></tr><tr>';
    
    var rows = [];
    for (var i =0; i < data.length; i++) {
        rows.push('<td>' + data[i].name + '</td><td>' + data[i].age + '</td>');
    }
    
    table += (rows.join('</tr><tr>') + '</tr></table>');
    container.innerHTML = table;
    fragment.appendChild(container);
    
    return fragment;
}