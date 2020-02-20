use crate::Animation;

/// Basic bubble sort
///
/// time: O(N^2)
/// space: O(1)
/// stable
///
/// swipes from left to right, each time reducing length by one
pub fn bubble_sort_inner(array: &mut [i32], animations: &mut Vec<Animation>) {
    for i in 1..(array.len()) {
        for j in 0..(array.len() - i) {
            animations.push(Animation::Compare(j,j+1));
            if array[j] > array[j+1] {
                animations.push(Animation::Swap(j,j+1));
                let tmp = array[j];
                array[j] = array[j+1];
                array[j+1] = tmp;
            }
        }
    }
}

/// Slightly optimized bubble sort
///
/// time: O(N^2)
/// space: O(1)
/// stable
///
/// swipes from left to right and then back
/// each time reducing length to the last swapped value
/// can be decent for nearly sorted array of any size
pub fn shake_sort_inner(array: &mut [i32], animations: &mut Vec<Animation>) {
    let mut from=0;
    let mut to=array.len() -1;
    let mut rev = false;
    while from < to {
        if !rev {
            let mut last_change = from;
            for j in from..to {
                animations.push(Animation::Compare(j,j+1));
                if array[j] > array[j+1] {
                    last_change = j;
                    animations.push(Animation::Swap(j,j+1));
                    let tmp = array[j];
                    array[j] = array[j+1];
                    array[j+1] = tmp;
                }
            }
            to = last_change;
        } else {
            let mut last_change = to;
            for j in (from..to).rev() {
                animations.push(Animation::Compare(j,j+1));
                if array[j] > array[j+1] {
                    last_change = j + 1;
                    animations.push(Animation::Swap(j,j+1));
                    let tmp = array[j];
                    array[j] = array[j+1];
                    array[j+1] = tmp;
                }
            }
            from = last_change;
        }
        rev = !rev;
    }
}
