$(document).ready(function() {

    var basePath = Drupal.settings.basePath;
    var modPath = basePath + "tbc_external_review/";
    
    /* for "tbc_external_review/comments" page */
    $book = $("#edit-book");
    $chapter = $("#edit-chapter");
    $chapter_wrapper = $("#edit-chapter-wrapper");
    $example = $("#edit-example");
    $example_wrapper = $("#edit-example-wrapper");
    $error_wrapper = $("#comment-error-wrapper");
    $submit = $("#edit-submit");
    $ajax_loader = $("#ajax-loader");

    $book.change(function() {
        var pid = $(this).val();
        $.ajax({
            url: modPath + "ajax/book/"+pid,
            type: "GET",
            success: function(data) {
                $chapter.html(data);
                $chapter_wrapper.show();
            },
        });
    });

    $chapter.change(function() {
        var cid = $(this).val();
        $.ajax({
            url: modPath + "ajax/chapter/"+cid,
            type: "GET",
            success: function(data) {
                $example.html(data);
                $example_wrapper.show();
            },
        });
    });

    $example.change(function() {
        $error_wrapper.show();
        $submit.show();
    });

    /* for "tbc_external_review/manage_comments/#some_number" page */
    $view_comment = $(".view-comment");
    $lightbox_wrapper = $("#lightbox-wrapper");
    $lightbox_inner = $("#lightbox-inner");
    $view_comment.click(function(e) {
        var comment_id = $(this).attr("data-comment");
        
        $.ajax({
            url: modPath + "ajax/comment/" + comment_id,
            type: "GET",
            dataType: "html",
            success: function(data) {
                $lightbox_inner.html(data);
                $lightbox_wrapper.lightbox_me({
                    centered: true
                });
            },
        });
        e.preventDefault();
    });

    /* hide/unhide comments */
    $hide_show= $(".hide-show");
    
    $hide_show.click(function(e) {
        var comment_id = $(this).attr("data-comment");
        $t = $(this);
        $.ajax({
            url: modPath + "ajax/hide-show/" + comment_id,
            type: "GET",
            dataType: "html",
            success: function(data) {
                $tr = $t.parents("tr:first");
                if($tr.hasClass("dull")) {
                    $t.parents("tr:first").removeClass("dull");
                    $t.html("Hide");
                } else {
                    $t.parents("tr:first").addClass("dull");
                    $t.html("Show");
                }
                console.log(data);
            },
        });
        e.preventDefault();
    });

    /* toggle hide-show */
    $toggler = $(".toggle-hide-show");
    $toggler.click(function() {
        var preference_id = $(this).attr("data-preference");
        
        $.ajax({
            url: modPath + "ajax/toggle/" + preference_id,
            type: "GET",
            success: function(data) {
                $tr = $("tr");
                $tr.each(function() {
                    if(!$(this).hasClass("error-comment")) {
                        if($(this).hasClass("dull")) {
                            $(this).removeClass("dull");
                            $(this).find(".hide-show").html("Hide");
                        } else {
                            $(this).addClass("dull");
                            $(this).find(".hide-show").html("Show");
                            $("thead tr").removeClass("dull");
                        }
                    }
                });
            }
        });
    });

    var count = 1;
    $more = $jq("#review-completion-form #more");
    $missed = $jq("#review-completion-form #missed-list");

    /* show/hide missed-list */
    $jq("#edit-missing-0").click(function() {
        $more.hide();
        $missed.hide();
    });
    $jq("#edit-missing-1").click(function() {
        $more.show();
        $missed.show();
    });
    /* review complete form  */
    $more.click(function(e) {
        $dupe = $missed.clone();
        $dupe.find("select[name='missed_chapter']").attr("id", "missed_chapter_" + count);
        $dupe.find("select[name='missed_chapter']").attr("name", "missed_chapters[]");
        $dupe.find("select[name='missed_example']").attr("id", "missed_example_" + count);
        $dupe.find("select[name='missed_example']").attr("name", "missed_examples[]");
        $dupe.insertBefore($more);
        $dupe.append("<a href='#' class='delete-missed'>Delete</a>");
        e.preventDefault();
    });

    $jq("#review-completion-form").on("click", ".delete-missed", function(e) {
        $jq(this).closest("#missed-list").remove();
        e.preventDefault();
    });

    $jq("#edit-cancel").click(function(e) {
        window.location = modPath + "status";
        e.preventDefault();
    });
    $(document).ajaxStart(function() {
        $ajax_loader.show();
    });
    $(document).ajaxStop(function() {
        $ajax_loader.hide();
    });
});
