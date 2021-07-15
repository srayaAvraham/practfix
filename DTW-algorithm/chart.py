import matplotlib.pyplot as plt
import numpy as np

def compare_tow_line(X, Y, filePath):
    plt.figure(figsize=(6, 2))
    plt.plot(X, c='k', label='$X$')
    plt.plot(Y, c='b', label='$Y$')
    plt.legend()
    plt.tight_layout()
    # plt.show()
    plt.savefig(filePath)

def optimal_path(P, D, fileDir):
    plt.subplot(1, 2, 2)
    plt.imshow(D, cmap='gray_r', origin='lower', aspect='equal')
    plt.plot(P[:, 1], P[:, 0], marker='o', color='r')
    plt.clim([0, np.max(D)])
    plt.colorbar()
    plt.title('$D$ with optimal warping path')
    plt.xlabel('Sequence Y')
    plt.ylabel('Sequence X')
    plt.tight_layout()
    # plt.show()
    plt.savefig(fileDir)