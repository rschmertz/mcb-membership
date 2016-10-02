angular.module('usersManagementApp')
    .factory('CardList', function($resource) {
        return $resource('https://api.trello.com/1/lists/566397b374bba06e49402f2d/cards'); // Note the full endpoint address
    })
    .factory('CardAttachments', function ($resource) {
        return $resource('https://api.trello.com/1/cards/:id/attachments');
    })
    .service('DocUtils', [function () {
        var icons = {
            doc: "img/file-icons/docx/docx_win-64_32.png",
            docx: "img/file-icons/docx/docx_win-64_32.png",
            pdf: "img/file-icons/pdf/pdf-64_32.png"
        };
        var miniIcons = {
            doc: "img/file-icons/docx/docx_win-24_32.png",
            docx: "img/file-icons/docx/docx_win-24_32.png",
            pdf: "img/file-icons/pdf/pdf-24_32.png"
        };

        var fileNameRegex = new RegExp(".+\.(pdf|doc|docx)");
        this.getIcon = function(url) {
            var match = url.match(fileNameRegex);
            //console.log("matchi is ", match[1]);
            return icons[match[1]];
        };
        this.getMiniIcon = function(url) {
            var match = url.match(fileNameRegex);
            //console.log("matchi is ", match[1]);
            return miniIcons[match[1]];
        };
        this.adjustUrl = function(url) {
            return url.replace(/dl=0$/, "dl=1");
        };
    }]);
