package org.docking.erbse.service;

import java.util.ArrayList;
import java.util.List;

import org.docking.erbse.dao.service.GenericService;
import org.docking.erbse.dao.serviceImpl.GenericServiceImpl;
import org.docking.erbse.util.GlobalVariable;
import org.docking.erbse.util.JsonParser;
import org.docking.erbse.vo.EditorReviewBBSVO;
import org.docking.erbse.vo.EditorVO;


public class ReviewServiceImpl implements ReviewService {

	@Override
	public Integer reviewAdd(EditorReviewBBSVO editorReview) {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		Integer res = reviewService.add("editorReview_add", editorReview);
		
		return res;
	}

	@Override
	public Integer reviewModify(EditorReviewBBSVO editorReview) {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		Integer res = reviewService.modify("editorReview_modify", editorReview);
		
		return res;
	}

	@Override
	public Integer reviewDelete(String reviewId) {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		Integer res = reviewService.delete("editorReview_delete", reviewId);
		
		return res;
	}

	@Override
	public String reviewSearch(String reviewId) {
		// TODO Auto-generated method stub
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		EditorReviewBBSVO ervo = reviewService.search("editorReview_search", reviewId);

		String[] objName = new String[]{"editorReviewBBSVO"};

		String jErvo = JsonParser.getInstance().jParseObj(GlobalVariable.EDITREVIEW_VO_FIELD, new String[]{ervo.getReviewId(),ervo.getEditorId(),ervo.getMemberId(),ervo.getBody(),String.valueOf(ervo.getScore()),ervo.getWrittenDate()});

		return JsonParser.getInstance().jParseObj(objName,new String[]{jErvo});

	}

	@Override
	public String reviewList(String logInMember) 
	{
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		List<EditorReviewBBSVO> ervoList = reviewService.searchAll("editorReview_searchAll");
		
		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"editorReviewBBSVO"};
		
		for(EditorReviewBBSVO ervo : ervoList)
		{
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.EDITREVIEW_VO_FIELD, new String[]{ervo.getReviewId(),ervo.getEditorId(),ervo.getMemberId(),ervo.getBody(),String.valueOf(ervo.getScore()),ervo.getWrittenDate(),logInMember}));
		}
		
		String[] ervoArr = new String[ervoList.size()];
		ervoArr = tmpList.toArray(ervoArr);
		String jErvoList = JsonParser.getInstance().jParseArr(ervoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jErvoList});
	}

	@Override
	public String reviewListByEditor(String editorId) 
	{
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		List<EditorReviewBBSVO> ervoList = reviewService.searchAll("editorReview_searchAll_key", editorId);

		List<String> tmpList = new ArrayList<String>();

		String[] objName = new String[]{"editorReviewBBSVO"};

		for(EditorReviewBBSVO ervo : ervoList)
		{
			tmpList.add(JsonParser.getInstance().jParseObj(GlobalVariable.EDITREVIEW_VO_FIELD, new String[]{ervo.getReviewId(),ervo.getEditorId(),ervo.getMemberId(),ervo.getBody(),String.valueOf(ervo.getScore()),ervo.getWrittenDate()}));
		}
		
		String[] ervoArr = new String[ervoList.size()];
		ervoArr = tmpList.toArray(ervoArr);
		String jErvoList = JsonParser.getInstance().jParseArr(ervoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jErvoList});
	}

	@Override
	public String reviewListByWriter(String memberId) 
	{
		GenericService<EditorVO>	reviewService = new GenericServiceImpl<EditorVO>();
		
		List<EditorReviewBBSVO>	tempErvoList = null;
		
		List<String> drList = new ArrayList<String>();
		
		String[] objName = new String[]{"developerReviewList"};
		Double	totalScore;
		
		for(EditorVO evo : reviewService.searchAll("editor_searchAll_key", memberId))
		{
			totalScore = 0.0;
			tempErvoList = reviewListForTotalScore(evo.getEditorId());
			
			for(EditorReviewBBSVO ervo : tempErvoList)
			{
				totalScore += ervo.getScore();
			}
			
			if(!(tempErvoList.size() == 0))
			{
				totalScore /= tempErvoList.size();
			}
		
			drList.add(JsonParser.getInstance().jParseObj(GlobalVariable.DEVELOPER_VIEW, new String[]{evo.getEditorId(),String.valueOf(evo.getEditorType()),String.valueOf(totalScore),String.valueOf(tempErvoList.size())}));
		}
		
		String[] ervoArr = new String[drList.size()];
		ervoArr = drList.toArray(ervoArr);
		String jErvoList = JsonParser.getInstance().jParseArr(ervoArr);

		return JsonParser.getInstance().jParseObj(objName,new String[]{jErvoList});
	}
	
	private List<EditorReviewBBSVO> reviewListForTotalScore(String editorId)
	{
		GenericService<EditorReviewBBSVO>	reviewService = new GenericServiceImpl<EditorReviewBBSVO>();
		
		return reviewService.searchAll("editorReview_searchAll_key", editorId);
	}
}