/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
    var list = $("#sortable");
    var dropLocation = {
        subPage: false,
        parent: null,
        prev: null
    };

    menuStructure = [];

    var init = function () {
        hideAll();

        //serializeList(list, menuStructure, dropLocation);
        $('.connect').sortable({
            connectWith: ".connect",
            revert: true,
            dropOnEmpty: false,
            placeholder: "dd-placeholder",
            start: function (event, ui) {
                var element = $(ui.item);
                dropLocation.prev = element.prev();
                menuStructure = [];
            },
            sort: function (event, ui) {
                var placeHolderOffset = $(".dd-placeholder").offset();
                var element = $(event.toElement).offset();
                if ((element.left - placeHolderOffset.left) > 10 && $(".dd-placeholder").parent().children('li').length >= 3) {
                    $(".dd-placeholder").css({
                        'margin-left': "30px"
                    });
                    dropLocation.subPage = true;
                    dropLocation.parent = $(".dd-placeholder").parent();
                    if ((element.top - placeHolderOffset.top) > 0) {
                        dropLocation.prev = $(".dd-placeholder").prev();
                        if (dropLocation.prev.hasClass('ui-sortable-helper')) {
                            dropLocation.prev = dropLocation.prev.prev();
                        }
                    } else {
                        dropLocation.prev = $(ui.item).prev();
                    }
                } else {
                    $(".dd-placeholder").css({
                        'margin-left': "0px"
                    });
                    dropLocation.subPage = false;
                    dropLocation.parent = null;
                }
            },
            stop: function (event, ui) {
                if (dropLocation.subPage) {
                    var dragItem = $(ui.item);
                    var ul = $("<ul class='dd-list connect'></ul>");
                    if ($(dropLocation.prev).children('ul').length <= 0) {
                        $(dropLocation.prev).append(ul);
                    }
                    $(dropLocation.prev).children('ul').append(dragItem);
                    dropLocation.prev = null;
                    serializeList(list, menuStructure, dropLocation);
                    init();
                } else {
                    serializeList(list, menuStructure, dropLocation);
                }
            }
        });
    };

    var hideAll = function (ul) {
        $("#ds-menu-hide-all").on('change', function () {
            if ($(this).is(':checked')) {
                list.find("li i").removeClass('fw-view');
                list.find("li i").addClass('fw-block');
            } else {
                list.find("li i").removeClass('fw-block');
                list.find("li i").addClass('fw-view');
            }
        });
    };

    var serializeList = function (ul, menu, opt) {
        var liElements = $(ul).children('li');
        if (liElements.length > 0) {
            for (var i = 0; i < liElements.length; i++) {
                var item = {
                    id: $.trim($(liElements[i]).attr("data-id")),
                    isHidden: false,
                    subordinates: [],
                    title: $.trim($(liElements[i]).children('div').text())
                };

                if ($(liElements[i]).children().length === 2) {
                    item.isHidden = $(liElements[i]).attr('data-anon');
                    serializeList($(liElements[i]).children('ul'), item.subordinates, opt);
                    menu.push(item);
                } else {
                    item.isHidden = $(liElements[i]).attr('data-anon');
                    menu.push(item);
                }
            }
        } else {
            $(ul).remove();
        }
    };

    init();
}());