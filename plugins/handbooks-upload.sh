#!/bin/sh

# cheap and cheerful pushing of files to TiddlySpace, 
# authorization taken from the variable UNAMESA_AUTH which for me is:
# export UNAMESA_AUTH='-u myuser:mypass'

# usage: sts spacename file1 file2 ..
space="$1" ; shift

#  public/private
pp=public

for file in "$@"
do
	tiddler=$(basename "$file")
	case "$file" in
	*.tid)
		content="text/plain"
		tiddler=$(basename "$file" .tid)
		;;
	*.mf)
		content="text/cache-manifest"
		;;
	*.html)
		content="text/html;charset=utf-8"
		tiddler=$(basename "$file" .html)
		;;
	*.svg)
		content="image/svg+xml"
		;;
	*.css)
		content="text/css"
		;;
	*.pdf)
		content="application/pdf"
		;;
	*.mov)
		content="video/quicktime"
		;;
	*.ogg)
		content="application/ogg"
		;;
	*.png)
		content="image/png"
		#tiddler=SiteIcon
		;;
	*.gif)
		content="image/gif"
		;;
	*.jpg)
		content="image/jpeg"
		;;
	*.ico)
		content="image/x-icon"
		;;
	*.woff)
		content="font/x-woff"
		;;
	*.eot)
		content="application/vnd.ms-fontobject"
		;;
	*.ttf)
		content="font/ttf"
		;;
	*.js)
		if [ ! -f $file.meta ]
		then
			content="text/javascript"
		else
			content="text/plain"
			o="$file"
			meta="$o.meta"
			file="/tmp/sts.tid"
			(
				cat $o.meta
				echo 
				cat $o 
			)> $file
			tiddler=$(basename "$o" .js)
		fi
		;;
	*)
		content="text/html"
		;;
	esac
	set -x
	curl -X PUT $UNAMESA_AUTH http://${space}.handbooks.unamesa.org/bags/${space}_$pp/tiddlers/$tiddler --data-binary @$file -H "Content-type: $content"
	set +x
done
