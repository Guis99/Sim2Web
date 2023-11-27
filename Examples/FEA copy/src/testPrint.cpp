#include <string>
#include <vector>
#include <iostream>

extern "C" {
    void printString(const char* stringsData, const int* stringLengths, int numStrings) {
        // int total_size = 0;
        // for (int i=0; i<numStrings; i++) {
        //     total_size += *(stringLengths+i);
        // }
        
        int offset = 0;
        std::vector<std::string> strs;
        for (int i = 0; i < numStrings; ++i) {
            const char* currentString = stringsData + offset;
            int currentStringLength = stringLengths[i];

            // Process the current string in your C++ function
            // ...

            strs.emplace_back(stringsData + offset, stringsData + offset + currentStringLength);
            // Move to the next string in linear memory
            offset += currentStringLength; // +1 for null terminator
        }

        for (auto str : strs) {
            std::cout<<"string: "<<str<<std::endl;
        }
    }
}
   