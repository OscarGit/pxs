package main

import (
	"github.com/opkna/wasmbridge"
)

func quickSort(data []uint32, start, end int, desc bool) {
	if start >= end {
		return
	}

	pivot := data[(start+end)/2]
	l, r := start, end
	for l < r {
		if desc {
			if data[l] < data[r] {
				s1, s2 := data[l], data[r]
				data[l] = s2
				data[r] = s1
			}

			if data[l] >= pivot {
				l++
			}
			if data[r] < pivot {
				r--
			}
		} else {
			if data[l] > data[r] {
				s1, s2 := data[l], data[r]
				data[l] = s2
				data[r] = s1
			}

			if data[l] <= pivot {
				l++
			}
			if data[r] > pivot {
				r--
			}
		}
	}
	quickSort(data, start, r-1, desc)
	quickSort(data, r+1, end, desc)
}

func quickSortVertical(data []uint32, start, end, w int, desc bool) {
	if start >= end {
		return
	}

	m := start + ((end-start)/(2*w))*w
	pivot := data[m]
	l, r := start, end
	for l < r {
		if desc {
			if data[l] < data[r] {
				p1, p2 := data[l], data[r]
				data[l] = p2
				data[r] = p1
			}
			if data[l] >= pivot {
				l += w
			}
			if data[r] < pivot {
				r -= w
			}

		} else {
			if data[l] > data[r] {
				p1, p2 := data[l], data[r]
				data[l] = p2
				data[r] = p1
			}
			if data[l] <= pivot {
				l += w
			}
			if data[r] > pivot {
				r -= w
			}
		}
	}

	quickSortVertical(data, start, r-w, w, desc)
	quickSortVertical(data, r+w, end, w, desc)
}

func calcLumin(data []byte, i int) float64 {
	sum := int(data[i]) + int(data[i+1]) + int(data[i+2])
	return float64(sum) / 765
}

func bytesToPixels(b []byte) []uint32 {
	length := len(b)
	pixels := make([]uint32, length/4)
	for i := 0; i < length; i += 4 {
		pixels[i/4] = uint32(b[i]) | uint32(b[i+1])<<8 | uint32(b[i+2])<<16 | uint32(b[i+3])<<24
	}
	return pixels
}

func pixelsToBytes(pixels []uint32) []byte {
	length := len(pixels)
	data := make([]byte, length*4)
	for i := 0; i < length; i++ {
		p := i * 4
		data[p] = byte(pixels[i])
		data[p+1] = byte(pixels[i] >> 8)
		data[p+2] = byte(pixels[i] >> 16)
		data[p+3] = byte(pixels[i] >> 24)
	}
	return data
}
func pivotPixels(pixels []uint32, width, height int) []uint32 {
	pivot := make([]uint32, width*height)
	i := 0
	for y := 0; y < height; y++ {
		for x := 0; x < width; x++ {
			pivot[y+x*height] = pixels[i]
			i++
		}
	}
	return pivot
}

// SortImage - Sort a image
func SortImage(args []interface{}) (interface{}, error) {
	data := args[0].([]byte)
	width := int(args[1].(float64))
	height := int(args[2].(float64))
	options := args[3].(map[string]interface{})

	desc := options["desc"].(bool)
	vertical := options["direction"].(string) != "horizontal"
	lowerRange := options["lowerRange"].(float64)
	upperRange := options["upperRange"].(float64)

	pixels := bytesToPixels(data)

	if vertical {
		for x := 0; x < width; x++ {
			quickSortVertical(pixels, x, x+(height-1)*width, width, desc)
		}
	} else {
		num := len(pixels)
		for i := 0; i < num; i += width {
			firstX := -1
			var x int
			for x = 0; x < width; x++ {
				v := calcLumin(data, (i+x)*4)
				if v >= lowerRange && v <= upperRange {
					if firstX == -1 {
						firstX = i + x
					}
				} else {
					if firstX != -1 {
						lastX := i + x - 1
						// Sort
						quickSort(pixels, firstX, lastX, desc)
						firstX = -1
					}
				}
			}
			if firstX != -1 {
				lastX := i + x - 1
				// Sort
				quickSort(pixels, firstX, lastX, desc)
			}
		}
	}

	data = pixelsToBytes(pixels)

	return data, nil
}

func main() {
	wasmbridge.ExportFunc("sortImage", SortImage, true)

	select {}
}
