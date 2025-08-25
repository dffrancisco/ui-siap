#!/bin/sh

dialog --title 'Update Taap' --yesno "\n Gostaria de fazer upload do Taap para a nuvem" 8 60
if [ $? = 0 ]; then

  cp package.json ./ui-taap
  zip -r ./ui-taap.zip ./ui-taap
  cp package.json ui-taap-package.json

  rsync -uahvrztP --compress-level=5 --progress ./ui-taap.zip ui-taap-package.json root@vyzo.com.br:/home/taap_server

  rm ./ui-taap.zip
  rm ui-taap-package.json

fi
