Template.textEditor.rendered = function() {
  $(function() {
    setTimeout(function() {
      console.log($("#full-editor").html());
        var fullEditor = new Quill('#full-editor', {
          formats: ['bold', 'italic', 'color'],
          modules: {
            'toolbar': { container: '#full-toolbar' },
            'link-tooltip': true
          },
          theme: 'snow'
        });
        fullEditor.addModule('toolbar', {
          container: '#full-toolbar'     // Selector for toolbar container
        });

        // Sync basic editor's cursor location
        fullEditor.on('selection-change', function(range) {
          if (range) {
            cursorManager.moveCursor('gandalf', range.end);
          }
        });

        // Update basic editor's content with ours
        fullEditor.on('text-change', function(delta, source) {
          if (source === 'user') {
            fullEditor.updateContents(delta);
          }
        });

        // fullEditor needs authorship module to accept changes from fullEditor's authorship module
        fullEditor.addModule('authorship', {
          authorId: 'gandalf',
          color: 'rgba(255,153,51,0.4)'
        });

        // Update our content with basic editor's
        fullEditor.on('text-change', function(delta, source) {
          if (source === 'user') {
            fullEditor.updateContents(delta);
          }
        });
        
      });
    }, 10);
}