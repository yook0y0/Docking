package org.docking.erbse.service;

import org.docking.erbse.vo.EditorReviewBBSVO;

public interface ReviewService {

	public Integer reviewAdd(EditorReviewBBSVO editorReview);
	public Integer reviewModify(EditorReviewBBSVO editorReview);
	public String reviewSearch(String reviewId);
	public Integer reviewDelete(String reviewId);
	public String reviewList();
	public String reviewListByEditor(String editorId);
	public String reviewListByWriter(String memberId);
}
