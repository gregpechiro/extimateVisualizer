
var project = {
    "name": "",
    "stages": new OrderedMap()
};

var colors = {
    "1": "#ffe6e6",
    "2": "#ffcccc",
    "3": "#ff9999",
    "4": "#ff6666",
    "5": "#ff4d4d",
    "6": "#ff3333",
    "7": "#ff1a1a",
    "8": "#ff0000",
    "9": "#e60000",
    "10": "#990000"
};

var nextId = 0;

$(document).ready(function() {
    $('a#start').click(function() {
        var name = $('input#projectName').val();
        if (name === '') {
            $('#projectName-error').css('display', 'block');
            return;
        }

        $('#projectName-error').css('display', 'none');
        project.name = name;

        var nextPage = project.stages.first();
        if (nextPage === undefined) {
            createStage();
            return;
        }

        $.mobile.changePage('#' + nextPage.id, {
            transition: "slide"
        });
    });

    $('a#restart').click(function() {
        project.stages.forEach(function(key, value) {
            $('#' + key).remove();
        });

        project = {
            "name": "",
            "stages": new OrderedMap()
        };

        $('input#projectName').val('');

        $.mobile.changePage('#main', {
            transition: "slide",
            reverse: true
        });

        $('div#done-diagram').html('');
        nextId = 0;
    });

    $('a#save').click(function() {
        prepareImage().then(function(canvas) {
            var img = canvas.toDataURL("image/png");
            $('a#hiddenDownload').attr('href', img);
            $('a#hiddenDownload').attr('download', project.name + '.png');
            $('a#hiddenDownload')[0].click();
            $('a#hiddenDownload').attr('href', '');
            $('a#hiddenDownload').attr('download', '');
             $('div#image-div').remove();
        });
    });

});

function prepareImage() {
    var scaleFactor = 2;
    var div = $('<div id="image-div"><div style="text-align:center;"><h2 style="text-decoration:underline;">' + project.name + '<br>Time/Complexity Diagram</h2></div></div>');
    div.css('opacity', '0.0');

    var diagram = $('div#done-diagram').clone();
    diagram.css('padding', '20px');
    diagram.attr('id', 'image-diagram');

    div.append(diagram);
    div.appendTo('body');
    var originalWidth = div.width();
    var originalHeight = div.height() + 20;

    // Create scaled canvas
    var scaledCanvas = document.createElement("canvas");
    scaledCanvas.width = originalWidth * scaleFactor;
    scaledCanvas.height = originalHeight * scaleFactor;
    scaledCanvas.style.width = originalWidth + "px";
    scaledCanvas.style.height = originalHeight + "px";
    var scaledContext = scaledCanvas.getContext("2d");
    scaledContext.scale(scaleFactor, scaleFactor);

    return html2canvas(div, {
        background: "#ffffff",
        canvas: scaledCanvas
    });
}

$(document).on('click', 'a#next-stage', function() {
    var parent = $(this).closest('div[data-role="page"]');

    if (!saveStage(parent)) {
        return;
    }

    var id = parent.attr('id');

    if (project.stages.isLast(id)) {
        createStage();
        return;
    }
    var changeId = project.stages.next(id).id;
    $.mobile.changePage('#' + changeId, {
        transition: "slide"
    });
});

function createStage() {
    var next = $(stagePage);
    next.attr('id', 'stage-' + nextId);
    next.appendTo($.mobile.pageContainer);
    $.mobile.changePage('#' + 'stage-' + nextId, {
        transition: "slide"
    });
    nextId++;
}

$(document).on('click', 'a#back', function() {
    var parent = $(this).closest('div[data-role="page"]');

    if (!saveStage(parent)) {
        return;
    }

    var id = parent.attr('id');
    var loc = 'main';
    if (!project.stages.isFirst(id)) {
        loc = project.stages.previous(id).id;
    }

    $.mobile.changePage('#' + loc, {
        transition: "slide",
        reverse:true
    });
});

$(document).on('click', 'a#remove', function() {
    var parent = $(this).closest('div[data-role="page"]');
    var id = parent.attr('id');
    var changeId = "main";

    if (project.stages.has(id)) {
        if (project.stages.isFirst(id) && !project.stages.isLast(id)) {
            changeId = project.stages.next(id).id;
        } else {
            changeId = project.stages.previous(id).id;
        }
    } else { // removing new page
        if (project.stages.last() !== undefined) {
            changeId = project.stages.last().id;
        }
    }

    project.stages.remove(id);
    $('#' + id).remove();
    $.mobile.changePage('#' + changeId, {
        transition: "slide"
    });
});

$(document).on('click', 'a#done', function() {
    var parent = $(this).closest('div[data-role="page"]');

    if (!saveStage(parent)) {
        return;
    }

    $('h1#done-header').html(project.name);

    $('div#done-diagram').html('');
    project.stages.forEach(function(k, v) {
        var st = $('<div class="circle" style="padding-bottom: ' + (v.time * 10) + '%;background-color:' + v.complex + ';"><div class="circle-caption">' + v.name + '</div></div>');
        st.appendTo('div#done-diagram');
        if (!project.stages.isLast(k)) {
            $('div#done-diagram').append('<br>');
        }
    });

    $.mobile.changePage('#done', {
        transition: "slide"
    });
});

function saveStage(parent) {
    var name = parent.find('input#name').val();
    if (name === '') {
        parent.find('#name-error').css('display', 'block');
        return false;
    }

    parent.find('#name-error').css('display', 'none');
    var time =+ parent.find('input#time').val();
    var comp = parent.find('input#complex').val();
    var id = parent.attr('id');
    var stage = {
        'name': name,
        'time': time,
        'complex': colors[comp],
        'id': id
    }

    project.stages.set(id, stage);
    return true;
}

var stagePage =
'<div data-role="page" id="">'+

    '<div data-role="header">'+
        '<h1>Stage Name</h1>'+
    '</div>'+
    '<div data-role="main" class="ui-content">'+
        '<span id="name-error" style="color:red;display:none;">Cannot be blank</span>'+
        '<input type="text" name="name" id="name" value="">'+
    '</div>'+

    '<div data-role="header">'+
        '<h1>Time Scale</h1>'+
    '</div>'+
    '<div data-role="main" class="ui-content">'+
        '<input type="range" name="time" id="time" data-highlight="true" min="1" max="10" value="1">'+
    '</div>'+

    '<div data-role="header">'+
        '<h1>Complexity Scale</h1>'+
    '</div>'+
    '<div data-role="main" class="ui-content">'+
        '<input type="range" name="complex" id="complex" data-highlight="true" min="1" max="10" value="1">'+
    '</div>'+

    '<div id="buttons" data-role="main" class="ui-content">'+
        '<a id="next-stage" class="ui-btn ui-corner-all">Next</a>'+
        '<a id="done" class="ui-btn ui-corner-all" data-transition="slide">Done</a>'+
        '<a href="" id="back" class="ui-btn ui-corner-all">Back</a>'+
        '<a id="remove" class="ui-btn ui-corner-all">Remove</a>'+
    '</div>'+

'</div>';
