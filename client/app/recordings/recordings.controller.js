'use strict';

angular.module('usersManagementApp')
  .controller('RecordingsCtrl', function ($scope) {
      this.message = 'Hello';
      this.kscope2017files = [
	  {
	      fileName: "1 Valdres March - Hanssen.mp3",
	      displayName: "Valdres",
	  },
	  {
	      fileName: "2 Psalm 46 - Zdechlik.mp3",
	      displayName: "Psalm 46",
	  },
	  {
	      fileName: "3 Handel in the Strand - Grainger.mp3",
	      displayName: "Handel in the Strand",
	  },
	  {
	      fileName: "4 Toccata - Frescobaldi.mp3",
	      displayName: "Toccata",
	  },
      ];
  });
