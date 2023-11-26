#include "..\Dependencies\FEALib\Solvers\Solvers.hpp"
#include "..\Dependencies\FEALib\Meshing\Meshing.hpp"

#include <iostream>
#include <fstream>
#include <vector>

int main(int argc, char* argv[]) {
    int nxElem;
    int nyElem;
    int xdeg; int ydeg;

    std::cout<<argc<<std::endl;

    for (int i=0; i<argc; i++) {
        std::cout<<argv[i]<<std::endl;
    }


    nxElem = std::stoi(argv[1]); nyElem = std::stoi(argv[2]);
    xdeg = std::stoi(argv[3]); ydeg = std::stoi(argv[4]);

    // std::cin>>nxElem;
    // std::cin>>nyElem;
    // std::cin>>xdeg;
    // std::cin>>ydeg;
    // std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

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
    
    std::string f = argv[5];
    std::vector<std::string> bcs;

    for (int i=6; i<10; i++) {
        bcs.push_back(argv[i]);
    }

    std::cout<<f<<std::endl;
    for (auto str : bcs) {
        std::cout<<str<<std::endl;
    }

    DD x = Solvers::MatrixAssembly::PoissonSolve(mesh, c, k, f, bcs);

    std::vector<double> xGrid;
    std::vector<double> yGrid;
    xGrid.reserve(widthX);
    yGrid.reserve(widthY);

    for (int i=0; i<widthX; i++) {
        auto xcoords = mesh.posOfNodes(std::vector<int>{i});
        xGrid.push_back(xcoords[0][0]);
    } 

    for (int i=0; i<widthY; i++) {
        int yIdx = i*widthX;
        auto ycoords = mesh.posOfNodes(std::vector<int>{yIdx});
        yGrid.push_back(ycoords[0][1]);
    } 

    Eigen::Map<DD> xOffsets(xGrid.data(), widthX, 1);
    Eigen::Map<DD> yOffsets(yGrid.data(), widthY, 1);

    std::ofstream fileX("x.txt");
    std::ofstream fileY("y.txt");
    std::ofstream fileZ("z.txt");

    if (fileZ.is_open())
    {
        fileZ << x;
    }
    if (fileX.is_open())
    {
        fileX << xOffsets;
    }
    if (fileY.is_open())
    {
        fileY << yOffsets;
    }

    x.resize(widthX,widthY);
}