package org.docking.erbse.service;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.util.JsonParseData;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.EditorReviewBBSVO;
import org.docking.erbse.vo.EditorVO;


public class ReviewServiceImpl implements ReviewService {

	@Override
	public Integer reviewAdd(EditorReviewBBSVO editorReview) {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		reviewService.add("editorReivew_add", editorReview);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public Integer reviewModify(EditorReviewBBSVO editorReview) {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		reviewService.modify("editorReview_modify", editorReview);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public Integer reviewDelete(String reviewId) {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		reviewService.delete("editorReview_delete", reviewId);

		Integer res = 0;
		/*
		 * res �� ó�� �ʿ�
		 */
		return res;
	}

	@Override
	public String reviewSearch(String reviewId) {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		EditorReviewBBSVO ervo = reviewService.search("editorReview_search", reviewId);

		String[] objName = new String[]{"editorReviewBBSVO"};

		/*
		 * DocumentVO Json
		 */
		String jErvo = JsonParser.getInstance().jParseObj(JsonParseData.EDITREVIEW_VO_FIELD, new String[]{ervo.getReviewId(),ervo.getEditorId(),ervo.getMemberId(),ervo.getBody(),String.valueOf(ervo.getScore()),ervo.getWrittenDate()});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jErvo});

	}

	@Override
	public String reviewList() {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		List<EditorReviewBBSVO> ervoList = reviewService.searchAll("editorReview_searchAll");
		
		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"editorReviewBBSVO"};

		/*
		 * DocumentVO List Json
		 */
		for(EditorReviewBBSVO ervo : ervoList){
			tmpList.add(JsonParser.getInstance().jParseObj(JsonParseData.EDITREVIEW_VO_FIELD, new String[]{ervo.getReviewId(),ervo.getEditorId(),ervo.getMemberId(),ervo.getBody(),String.valueOf(ervo.getScore()),ervo.getWrittenDate()}));
		}
		String[] ervoArr = new String[ervoList.size()];
		ervoArr = tmpList.toArray(ervoArr);
		String jErvoList = JsonParser.getInstance().jParseArr(ervoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jErvoList});
	}

	@Override
	public String reviewListByEditor(String editorId) {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		List<EditorReviewBBSVO> ervoList = reviewService.searchAll("editorReview_searchAll_key", editorId);

		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"editorReviewBBSVO"};

		/*
		 * DocumentVO List Json
		 */
		for(EditorReviewBBSVO ervo : ervoList){
			tmpList.add(JsonParser.getInstance().jParseObj(JsonParseData.EDITREVIEW_VO_FIELD, new String[]{ervo.getReviewId(),ervo.getEditorId(),ervo.getMemberId(),ervo.getBody(),String.valueOf(ervo.getScore()),ervo.getWrittenDate()}));
		}
		String[] ervoArr = new String[ervoList.size()];
		ervoArr = tmpList.toArray(ervoArr);
		String jErvoList = JsonParser.getInstance().jParseArr(ervoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jErvoList});
	}

	@Override
	public String reviewListByWriter(String memberId) {
/*		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		List<EditorReviewBBSVO> ervoList = reviewService.searchAll("editorReview_searchAll_key", memberId);

		String jRes = null;
		JsonParser.getInstance();
		
		 * Json Ÿ�� ĳ���� �ʿ�
		 
		return jRes;*/
		
		/*
		 * Writer �� ����˻� ���;���.
		 */
		return null;
	}
}