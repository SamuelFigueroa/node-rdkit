# Attempts to find RDKit libraries using the current value of $RDBASE
# or, failing that, a version in my home directory
# It returns the static (.a) libraries not the .so ones because that's
# easiest for shipping (on Unix anyway. This may have to change once I start
# dealing with Windows as well.)
#
# It will define
# RDKIT_FOUND as MyRDKit_FOUND if it finds everything it needs
# RDKIT_INCLUDE_DIR
# RDKIT_LIBRARIES as requested

set(RDKit_DIR $ENV{RDBASE})
set(RDKit_INCLUDE_DIR ${RDKit_DIR}/Code)
set(RDKit_FOUND "RDKit_FOUND")
# libraries, as specified in the COMPONENTS
foreach(component ${RDKit_FIND_COMPONENTS})
  message( "Looking for RDKit component ${component}" )
  if(APPLE)
      find_file( RDKit_LIBRARY_${component}
        libRDKit${component}.dylib
        PATH ${RDKit_DIR}/build/lib NO_DEFAULT_PATH)
   endif()
   if (UNIX AND NOT APPLE)
        find_file( RDKit_LIBRARY_${component}
          libRDKit${component}.so
          PATH ${RDKit_DIR}/build/lib NO_DEFAULT_PATH)
    endif()
  message("RDKit_LIBRARY_${component} : ${RDKit_LIBRARY_${component}}")
  if(${RDKit_LIBRARY_${component}} MATCHES "-NOTFOUND$")
    message(FATAL_ERROR "Didn't find RDKit ${component} library.")
  endif(${RDKit_LIBRARY_${component}} MATCHES "-NOTFOUND$")
  set(RDKit_LIBRARIES ${RDKit_LIBRARIES} ${RDKit_LIBRARY_${component}})
endforeach(component)

message("RDKIT_INCLUDE_DIR : ${RDKit_INCLUDE_DIR}")
message("RDKIT_LIBRARIES : ${RDKit_LIBRARIES}")
message("RDKIT_FOUND : ${RDKit_FOUND}")
