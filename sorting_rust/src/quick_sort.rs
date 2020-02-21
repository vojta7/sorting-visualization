use crate::Animation;

pub fn quick_sort_inner(arr:&mut [i32], lo: usize, hi: usize, animations: &mut Vec<Animation>) {
    if lo < hi {
        let p = partition(arr, lo, hi, animations);
        quick_sort_inner(arr,lo,std::cmp::max(1,p)-1,animations);
        quick_sort_inner(arr,p + 1,hi,animations);
    }
}

fn partition(arr:&mut [i32], lo: usize, hi: usize, animations: &mut Vec<Animation>) -> usize {
    let pivot = arr[hi];
    let mut i = lo;
    for j in lo..=hi {
        animations.push(Animation::Compare(i,j));
        if arr[j] < pivot {
            animations.push(Animation::Swap(i,j));
            arr.swap(i,j);
            i = i+1;
        }
    }
    animations.push(Animation::Swap(i,hi));
    arr.swap(i,hi);
    i
}
