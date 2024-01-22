#!/bin/sh

dialog --title 'Update Siap' --yesno "\n Gostaria de fazer upload do Siap para o 60?" 8 60
if [ $? = 0 ]; then

  cp package.json ./ui-siap

  zip -r ./ui-siap.zip ./ui-siap

  rsync -uahvrztP -e 'ssh -p 2608' --compress-level=5 --progress ./ui-siap.zip package.json real@192.168.100.60:/home/siap/serverSiap

  rm ./ui-siap.zip

fi
