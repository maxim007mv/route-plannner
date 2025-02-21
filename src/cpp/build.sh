#!/bin/bash

# Создаем директорию для wasm если её нет
mkdir -p ../../assets/wasm

# Компилируем C++ в WebAssembly с поддержкой embind
emcc route_calculator.cpp \
    -o ../../assets/wasm/route_calculator.js \
    -s WASM=1 \
    -s MODULARIZE=1 \
    -s 'EXPORT_NAME="createModule"' \
    -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
    -s EXPORTED_FUNCTIONS='["_malloc", "_free"]' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s NO_EXIT_RUNTIME=1 \
    -lembind \
    --bind \
    -O3

# Проверяем успешность компиляции
if [ $? -eq 0 ]; then
    echo "Компиляция успешно завершена"
    echo "Файлы сохранены в ../../assets/wasm/"
else
    echo "Ошибка при компиляции"
    exit 1
fi
