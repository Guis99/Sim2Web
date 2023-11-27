#include <string>
#include <vector>
#include <iostream>

#include "..\Dependencies\Eigen\Eigen"

typedef Eigen::MatrixXd DD;

extern "C" {
    void printStrings(const char* stringsData, const int* stringLengths, int numStrings) {
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

            strs.emplace_back(currentString, currentString + currentStringLength);
            // Move to the next string in linear memory
            offset += currentStringLength; // +1 for null terminator
        }

        for (auto str : strs) {
            std::cout<<"string: "<<str<<std::endl;
        }
    }

    void printString(const char* stringsData, const int* stringLength) {
        std::cout<<(*stringLength)<<std::endl;
        std::string str(stringsData, stringsData + (*stringLength));
        std::cout<<str<<std::endl;
    }

    struct MatrixInfo {
        void* dataPtr;
        DD* matPtr;
    };

    void* createMatrix(int sizeSq) {
        std::vector<double> holder;
        holder.reserve(sizeSq*sizeSq);
        for (int i=1; i<=sizeSq*sizeSq; i++) {
            holder.push_back(i);
        }
        Eigen::Map<DD> mat(holder.data(), sizeSq, sizeSq);
        DD* matrix = new DD(mat);

        MatrixInfo info;
        info.matPtr = matrix;
        info.dataPtr = matrix->data();
        std::cout<<"making matrix"<<std::endl;
        return &info;
    }

    void* getDataPtr(MatrixInfo* matrixInfo) {
        return matrixInfo->dataPtr;
    }

    void* getMatrixPtr(MatrixInfo* matrixInfo) {
        return matrixInfo->matPtr;
    }

    void freeStruct(void* matrixInfo) {
        delete static_cast<MatrixInfo*>(matrixInfo);
    }

    void freeMatrix(void* matrixPtr) {
        delete static_cast<DD*>(matrixPtr);
    }
}
   