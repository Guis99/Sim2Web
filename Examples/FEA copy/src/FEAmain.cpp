#include "..\Dependencies\FEALib\Solvers\Solvers.hpp"
#include "..\Dependencies\FEALib\Meshing\Meshing.hpp"

#include <iostream>
#include <fstream>
#include <vector>

extern "C" {
    struct Solution {
        DD *xGrid;
        DD *yGrid;
        DD *solution;
    };

    void* SolveSystem(int nxElem, int nyElem, int xdeg, int ydeg, 
                        std::string f, std::vector<std::string> bcs) {


        std::cout<<"nxElem: "<<nxElem<<std::endl;
        std::cout<<"nyElem: "<<nyElem<<std::endl;
        std::cout<<"xdeg: "<<xdeg<<std::endl;
        std::cout<<"ydeg: "<<ydeg<<std::endl;

        std::cout<<f<<std::endl;
        for (auto str : bcs) {
            std::cout<<"string: "<<str<<std::endl;
        }

        std::vector<double> xdivs;
        xdivs.reserve(nxElem);
        for (int i = 0; i < nxElem; i++) {
            xdivs.push_back(4.0/nxElem);
        }

        std::vector<double> ydivs;
        ydivs.reserve(nyElem);

        for (int i = 0; i < nyElem; i++) {
            ydivs.push_back(4.0/nyElem);
        }

        int widthX = nxElem*xdeg+1;
        int widthY = nyElem*ydeg+1;

        Meshing::BasicMesh::BasicMesh2D mesh(xdeg, ydeg, xdivs, ydivs, 0, 0);   

        double c = 1;
        double k = 1;

        std::cout<<"Calling solver"<<std::endl;
        DD x = Solvers::MatrixAssembly::PoissonSolve(mesh, c, k, f, bcs);
        std::cout<<"Solution retrieved"<<std::endl;

        std::vector<double> xGrid;
        std::vector<double> yGrid;
        std::cout<<"debug1"<<std::endl;
        xGrid.reserve(widthX);
        yGrid.reserve(widthY);
        std::cout<<"debug2"<<std::endl;

        for (int i=0; i<widthX; i++) {
            auto xcoords = mesh.posOfNodes(std::vector<int>{i});
            xGrid.push_back(xcoords[0][0]);
        } 
        std::cout<<"debug3"<<std::endl;
        for (int i=0; i<widthY; i++) {
            int yIdx = i*widthX;
            auto ycoords = mesh.posOfNodes(std::vector<int>{yIdx});
            yGrid.push_back(ycoords[0][1]);
        } 

        std::cout<<"debug4"<<std::endl;

        Eigen::Map<DD> xOffsets(xGrid.data(), widthX, 1);
        std::cout<<"debug5"<<std::endl;
        Eigen::Map<DD> yOffsets(yGrid.data(), widthY, 1);

        std::cout<<"debug6"<<std::endl;
        DD* xPos = new DD(xOffsets);
        DD* yPos = new DD(yOffsets);

        std::cout<<"debug7"<<std::endl;
        std::vector<DD>* out = new std::vector<DD>({xOffsets, yOffsets, x});

        // Solution soln;
        // soln.solution = &x;
        // std::cout<<&x<<std::endl;
        // std::cout<<"debug8"<<std::endl;
        // soln.xGrid = xPos;
        // std::cout<<"debug9"<<std::endl;
        // soln.yGrid = yPos;
        // std::cout<<"debug10"<<std::endl;
        // Solution* out = &soln;
        // std::cout<<"debug11"<<std::endl;
        return out;
    }

    double* getMatrixPtr(std::vector<DD>* matVec, int i) {
        return (*matVec)[i].data();
    }

    void* captureArgs(const char* stringsData, const int* stringLengths, int numStrings, const int* meshParams) {
        // int total_size = 0;
        // for (int i=0; i<numStrings; i++) {
        //     total_size += *(stringLengths+i);
        // }
        std::cout<<"ca1"<<std::endl;
        int offset = 0;
        std::cout<<"ca2"<<std::endl;
        std::vector<std::string> strs;
        std::cout<<"ca3"<<std::endl;
        for (int i = 0; i < numStrings; ++i) {
            const char* currentString = stringsData + offset;
            int currentStringLength = stringLengths[i];

            // Process the current string in your C++ function
            // ...

            strs.emplace_back(currentString, currentString + currentStringLength);
            // Move to the next string in linear memory
            offset += currentStringLength; // +1 for null terminator
        }
        std::cout<<"ca4"<<std::endl;

        int nxElem = meshParams[0];
        std::cout<<"ca5"<<std::endl;
        int nyElem = meshParams[1];
        std::cout<<"ca6"<<std::endl;
        int xdeg = meshParams[2];
        std::cout<<"ca7"<<std::endl;
        int ydeg = meshParams[3];
        std::cout<<"ca8"<<std::endl;
        std::string source = strs[0];
        std::cout<<"ca9"<<std::endl;
        std::vector<std::string> bcs(strs.data() + 1, strs.data() + strs.size());
        std::cout<<"ca10"<<std::endl;
        // Solution *out = new Solution;
        std::cout<<"solved??"<<std::endl;
        auto out = SolveSystem(nxElem, nyElem, xdeg, ydeg, source, bcs);
        std::cout<<"debug12"<<std::endl;
        return out;
    }
}

// int main(int argc, char* argv[]) {
//     int nxElem;
//     int nyElem;
//     int xdeg; int ydeg;

//     std::cout<<argc<<std::endl;

//     for (int i=0; i<argc; i++) {
//         std::cout<<argv[i]<<std::endl;
//     }


//     nxElem = std::stoi(argv[1]); nyElem = std::stoi(argv[2]);
//     xdeg = std::stoi(argv[3]); ydeg = std::stoi(argv[4]);

//     std::vector<double> xdivs;
//     xdivs.reserve(nxElem);
//     for (int i = 0; i < nxElem; i++) {
//         xdivs.push_back(4.0/nxElem);
//     }

//     std::vector<double> ydivs;
//     ydivs.reserve(nyElem);

//     for (int i = 0; i < nyElem; i++) {
//         ydivs.push_back(4.0/nyElem);
//     }

//     int widthX = nxElem*xdeg+1;
//     int widthY = nyElem*ydeg+1;

//     Meshing::BasicMesh::BasicMesh2D mesh(xdeg, ydeg, xdivs, ydivs, 0, 0);   

//     double c = 1;
//     double k = 1;
    
//     std::string f = argv[5];
//     std::vector<std::string> bcs;

//     for (int i=6; i<10; i++) {
//         bcs.push_back(argv[i]);
//     }

//     DD x = Solvers::MatrixAssembly::PoissonSolve(mesh, c, k, f, bcs);

//     std::vector<double> xGrid;
//     std::vector<double> yGrid;
//     xGrid.reserve(widthX);
//     yGrid.reserve(widthY);

//     for (int i=0; i<widthX; i++) {
//         auto xcoords = mesh.posOfNodes(std::vector<int>{i});
//         xGrid.push_back(xcoords[0][0]);
//     } 

//     for (int i=0; i<widthY; i++) {
//         int yIdx = i*widthX;
//         auto ycoords = mesh.posOfNodes(std::vector<int>{yIdx});
//         yGrid.push_back(ycoords[0][1]);
//     } 

//     Eigen::Map<DD> xOffsets(xGrid.data(), widthX, 1);
//     Eigen::Map<DD> yOffsets(yGrid.data(), widthY, 1);

//     std::ofstream fileX("x.txt");
//     std::ofstream fileY("y.txt");
//     std::ofstream fileZ("z.txt");

//     if (fileZ.is_open())
//     {
//         fileZ << x;
//     }
//     if (fileX.is_open())
//     {
//         fileX << xOffsets;
//     }
//     if (fileY.is_open())
//     {
//         fileY << yOffsets;
//     }

//     x.resize(widthX,widthY);
// }