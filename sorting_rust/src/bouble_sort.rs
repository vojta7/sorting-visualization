use crate::Animation;

pub fn bouble_sort_inner(array: &mut [i32], animations: &mut Vec<Animation>) {
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
