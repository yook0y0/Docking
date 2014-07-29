package kr.co.docking.service;

import kr.co.docking.vo.EditorReviewBBSVO;

public interface ReviewService {

	public Integer reviewAdd(EditorReviewBBSVO editorReview);
	public Integer reviewModify(EditorReviewBBSVO editorReview);
	public Integer reviewDelete(String reviewId);
	public String reviewSearch(String reviewId);
	public String reviewList();
	public String reviewListByEditor(String editorId);
	public String reviewListByWriter(String memberId);
	
	
}
