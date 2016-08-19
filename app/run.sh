#!/bin/sh

app_path="/usr/src/app"

task_compile=0

while [ "$1" != "" ]; 
do
	PARAM=$(echo "$1" | awk -F= '{print $1}')
	# VALUE=$(echo "$1" | awk -F= '{print $2}')

	case $PARAM in
		# -h | --help)
		#     usage
		#     exit
		#     ;;
		
		-i)
			ash
			exit
			;;

		-c | --compile)
			task_compile=1
			
			;;

		*)
			echo "ERROR: unknown parameter \"$PARAM\""
			usage
			exit 1
			;;
	esac
	shift
done

#######################
# TASK: COPY NWJS
if [ $task_compile -eq 1 ]; then
	framework_file="PaperColor.vim"

	# Custom temporary runtime path for vim
	custom_rtp=$(mktemp -d)

	# Add color scheme to runtime part
	mkdir -p "${custom_rtp}/colors"
	cp ${framework_file} "${custom_rtp}/colors"

	# Minimum vimrc file
	cat > "${custom_rtp}/.vimrc" <<- EOF
	set rtp+=${custom_rtp}
	color PaperColor
	EOF

	# Go to temporary build directory
	cd "$(mktemp -d)" || exit 1

	# Generate intermediate file
	vim -Nu "${custom_rtp}/.vimrc" -c 'call PaperColor#GenerateSpecs()' +qall

	highlighting_file="highlightings.yml"

	[ ! -f "$highlighting_file" ] && echo "Can't detect intermediate file: $highlighting_file" && exit 1

	# invoke compiler
	node ${app_path}/compile.js ${highlighting_file}

	[ "$?" -ne 0 ] && echo "Program terminated with non-zero exit code." && exit 1

fi


