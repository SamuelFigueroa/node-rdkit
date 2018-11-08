cmake_minimum_required(VERSION 3.1)

# Name of the project (will be the name of the plugin)
project (node-rdkit)

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/Modules/")

set(Boost_USE_STATIC_LIBS ON)
set(Boost_USE_MULTITHREADED OFF)
set(Boost_USE_STATIC_RUNTIME ON)
find_package( Boost COMPONENTS iostreams filesystem system)

find_package( Cairo REQUIRED )

find_package( RDKit COMPONENTS ChemReactions FileParsers SmilesParse Depictor RDGeometryLib
  RDGeneral SubstructMatch Subgraphs MolDraw2D GraphMol DistGeometry DistGeomHelpers
  MolAlign Optimizer ForceField ForceFieldHelpers Alignment
  ForceField  MolTransforms EigenSolvers )

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${RDKit_INCLUDE_DIR}/cmake/Modules/")

find_package (Threads)

set(RDKit_THREAD_LIBS Threads::Threads)

set( LIBS ${LIBS} ${RDKit_LIBRARIES} Boost::iostreams ${RDKit_THREAD_LIBS} z  )

include_directories(${RDKit_INCLUDE_DIR})

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

# Essential include files to build a node addon,
# you should add this line in every CMake.js based project.
include_directories(${CMAKE_JS_INC} "${CMAKE_SOURCE_DIR}/node_modules/node-addon-api")

message("CMAKE SOURCE DIR ${CMAKE_SOURCE_DIR}/node_modules/node-addon-api")
# Declare the source files location
file(GLOB SOURCE_FILES "src/*.cc" "src/*.h")

# This line will tell CMake that we're building a shared library
# from the above source files
# named after the project's name
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

# This line will give our library file a .node extension
# without any "lib" prefix
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# Include N-API wrappers
target_include_directories(${PROJECT_NAME}
    PRIVATE ${CMAKE_JS_INC}
    PRIVATE "${CMAKE_SOURCE_DIR}/node_modules/node-addon-api")

# Essential library files to link to a node addon,
# you should add this line in every CMake.js based project.
target_link_libraries(${PROJECT_NAME}
    PRIVATE ${CMAKE_JS_LIB}
    ${LIBS})
